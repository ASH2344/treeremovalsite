export default function Breadcrumbs({ items }: { items: { url: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-forest-100">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.url} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-white">{item.label}</span>
              ) : (
                <>
                  <a href={item.url} className="underline-offset-2 hover:text-white hover:underline">{item.label}</a>
                  <span aria-hidden="true" className="text-forest-200">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
