import ProductCard, { ProductType } from "./ProductCard";

interface ProductListProps {
  title?: string;
  products: ProductType[];
  ctaLabel?: string;
}

const ProductList = ({ title, products, ctaLabel }: ProductListProps) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-12 w-full">
      {title && (
        <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 rounded-full bg-blue-600" />
            <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
              {title}
            </h2>
          </div>
          <div className="hidden h-px flex-1 bg-slate-100 mx-8 md:block" />
          <button className="text-[11px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-blue-600">
            Xem tất cả
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id ?? product.name}
            product={product}
            ctaLabel={ctaLabel}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
