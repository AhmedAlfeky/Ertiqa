"use client";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./PhoneInput.css";
import ar from "react-phone-input-2/lang/ar.json";
import { useFormContext } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useState } from "react";

interface ExtendedPhoneProps {
  onChange: (value: any) => void;
  name: string;
  returnFullPhone?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
}

const PhoneSearch = ({
  onChange,
  name,
  returnFullPhone = true,
  defaultValue,
  disabled = false,
  placeholder,
}: ExtendedPhoneProps) => {
  const t = useTranslations("auth");
  const locale = useLocale();
  const form = useFormContext();
  const [value, setValue] = useState(defaultValue || "");

  const handleChange = useCallback(
    (value: string, country: any) => {
      setValue(value);

      // Always return string value for form validation
      const phoneValue = `${value}`;

      onChange(phoneValue);
      form.setValue(name, phoneValue);
    },
    [onChange, name, form]
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }, []);

  return (
    <div className="phone-input-container">
      {locale === "ar" ? (
        <PhoneInput
          localization={ar}
          country="eg"
          value={value}
          onChange={handleChange}
          placeholder={placeholder || t("phonePlaceholder")}
          searchPlaceholder={t("searchCountries") || "Search countries..."}
          disabled={disabled}
          inputProps={{
            onKeyDown: handleKeyDown,
            disabled: disabled,
          }}
        />
      ) : (
        <PhoneInput
          country="eg"
          value={value}
          onChange={handleChange}
          placeholder={placeholder || t("phonePlaceholder")}
          searchPlaceholder={t("searchCountries") || "Search countries..."}
          disabled={disabled}
          inputProps={{
            onKeyDown: handleKeyDown,
            disabled: disabled,
          }}
        />
      )}
    </div>
  );
};

export default PhoneSearch;
