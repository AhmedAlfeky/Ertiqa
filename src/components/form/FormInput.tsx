import React, { useState, lazy, Suspense } from "react";
import { FormField, FormLabel, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

import { useLocale, useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

const PhoneInput = lazy(() => import("./PhoneInput"));

interface FormInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  formType: "input" | "textarea" | "switch" | "phone";
  inputType?: "text" | "email" | "password" | "tel" | "number" | "url";
  disabled?: boolean;
  required?: boolean;
  className?: string;
  rows?: number; // For textarea
  description?: string; // For switch
  password?: boolean;
  serverError?: string; // Server error message
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  placeholder,
  formType,
  inputType = "text",
  disabled = false,
  required = false,
  className = "",
  rows = 3,
  description,
  password = false,
  serverError,
}) => {
  const locale = useLocale();
  const t = useTranslations("auth");
  const isRTL = locale === "ar";
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const getLabel = () => {
    if (label) return label;
    return t(name as any) || name;
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return t(`${name}Placeholder` as any) || `Enter ${name}`;
  };

  const renderInput = (field: any) => {
    const commonProps = {
      ...field,
      disabled: disabled,
      className: className,
    };

    switch (formType) {
      case "input":
        return (
          <div className="relative w-full">
            <Input
              dir={isRTL ? "rtl" : "ltr"}
              type={password ? (showPassword ? "text" : "password") : inputType}
              placeholder={getPlaceholder()}
              {...commonProps}
              className={`${commonProps.className} ${password ? "ps-10" : ""}`}
            />{" "}
            {password && (
              <button
                type="button"
                className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                disabled={disabled}
                aria-label={showPassword ? t("hidePassword") : t("showPassword")}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}
          </div>
        );

      case "textarea":
        return <Textarea placeholder={getPlaceholder()} rows={rows} {...commonProps} />;

      case "switch":
        return (
          <div className="flex items-center gap-2">
            <Switch checked={field.value} onCheckedChange={field.onChange} disabled={disabled} />
            {description && <span className="text-sm text-muted-foreground">{description}</span>}
          </div>
        );

      case "phone":
        return (
          <div className="relative z-10">
            <Suspense fallback={<div className="h-10 w-full animate-pulse bg-gray-200 rounded-md" />}>
              <PhoneInput
                name={name}
                onChange={field.onChange}
                disabled={disabled}
                placeholder={getPlaceholder()}
                returnFullPhone={false}
                defaultValue={field.value}
              />
            </Suspense>
          </div>
        );

      default:
        return <Input type={inputType} placeholder={getPlaceholder()} {...commonProps} />;
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`form-field ${className}`}>
          {formType !== "switch" && (
            <FormLabel dir={isRTL ? "rtl" : "ltr"}>
              {getLabel()}
              {required && <span className="text-destructive ms-1">*</span>}
            </FormLabel>
          )}
          <FormControl>{renderInput(field)}</FormControl>
          {serverError ? <p className="text-sm font-medium text-destructive">{serverError}</p> : <FormMessage />}
        </FormItem>
      )}
    />
  );
};

export default FormInput;
