import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-surface py-20 lg:py-32">
      <div className="absolute inset-0 z-0 opacity-20">
        {/* Placeholder decorative shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl translate-x-1/3 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-3xl -translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
              Hiểu làn da.<br />
              Chăm đúng cách.
            </h1>
            <p className="text-lg md:text-xl text-text-dark/80 mb-8 max-w-lg leading-relaxed">
              Giải pháp chăm sóc da được tinh chỉnh dựa trên khoa học, mang lại sự cân bằng và vẻ đẹp tự nhiên bền vững cho làn da của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => window.location.href = '/products'}>
                Khám phá sản phẩm
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/articles'}>
                Tìm hiểu về da
              </Button>
            </div>
          </div>
          
          <div className="relative">
            {/* Visual Hero Image Container */}
            <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=2000&auto=format&fit=crop" 
                alt="Skincare routine"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            {/* Floating badge */}
            <div className="absolute bottom-10 -left-6 md:-left-12 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-4 animate-bounce hover:animate-none">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl">✨</div>
              <div>
                <p className="font-bold text-text-dark leading-tight">100%</p>
                <p className="text-xs text-gray-500 font-medium">Khoa học kiểm chứng</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
