import { Link } from 'react-router-dom';
import { SKIN_CONCERNS } from '../../utils/constants';
import { ArrowRight } from 'lucide-react';

export function SkinConcernsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Bạn đang gặp vấn đề gì?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Chọn vấn đề về da bạn đang quan tâm để khám phá giải pháp phù hợp nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {SKIN_CONCERNS.map((concern) => (
            <Link
              key={concern.label}
              to={`/products?keyword=${concern.categoryKeyword}`} // We use keyword since category is slug based and we don't have exact slugs guaranteed from API yet, but it works as search
              className="group bg-surface rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                {concern.icon}
              </div>
              <h3 className="font-semibold text-text-dark text-lg mb-2 group-hover:text-primary transition-colors">
                {concern.label}
              </h3>
              <p className="text-sm text-gray-500 mb-4 flex-1">
                {concern.description}
              </p>
              <span className="text-primary text-sm font-medium flex items-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                Xem giải pháp <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
