import { cn } from '@/utils';

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'm-4',
        'prose:text-white',
        'prose-headings:mt-10',
        'prose-headings:mb-6',
        'prose-headings:font-semibold',
        'prose-h1:text-5xl',
        'prose-h2:text-4xl',
        'prose-h3:text-3xl',
        'prose-h4:text-2xl',
        'prose-h5:text-xl',
        'prose-h6:text-lg',
        'prose-ul:my-2',
        'prose-ul:ml-6',
        'prose-ul:list-disc',
        'prose-p:my-2',
      )}
    >
      {children}
    </div>
  );
}
