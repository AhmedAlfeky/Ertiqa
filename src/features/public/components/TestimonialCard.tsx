import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Props = {
  testimonial: {
    name?: string | null;
    job_title?: string | null;
    content: string;
    photo_url?: string | null;
  };
};

export function TestimonialCard({ testimonial }: Props) {
  const initials = (testimonial.name || 'U')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);

  return (
    <Card className="bg-card border shadow-sm">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={testimonial.photo_url || ''} alt={testimonial.name || ''} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{testimonial.name || '—'}</p>
            <p className="text-xs text-muted-foreground">
              {testimonial.job_title || ''}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">“{testimonial.content}”</p>
      </CardContent>
    </Card>
  );
}

