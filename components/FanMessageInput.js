    import { Textarea } from '@/components/ui/textarea';

    export function FanMessageInput({ value, onChange }) {
      return (
        <Textarea
          value={value}
          onChange={onChange}
          placeholder="Add a personalized message or reaction GIF"
          className="min-h-[100px]"
        />
      );
    }
  