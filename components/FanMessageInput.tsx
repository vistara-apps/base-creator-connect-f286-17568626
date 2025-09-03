    import { Textarea } from '@/components/ui/textarea';

    export function FanMessageInput({ value, onChange }: { value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }) {
      return <Textarea value={value} onChange={onChange} placeholder="Add a message or reaction" />;
    }
  