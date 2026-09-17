import { ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';

export function CTABannerSection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=2000&auto=format&fit=crop" 
          alt="Natural skincare"
          className="w-full h-full object-cover opacity-20 grayscale"
        />
        <div className="absolute inset-0 bg-secondary/80 mix-blend-multiply"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Bắt đầu hành trình chăm sóc da khoa học
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Khám phá bộ sưu tập sản phẩm của chúng tôi và tìm ra giải pháp hoàn hảo cho làn da của bạn ngay hôm nay.
        </p>
        <Button 
          size="lg" 
          onClick={() => navigate('/products')}
          className="bg-white text-primary hover:bg-surface font-semibold px-8"
        >
          Khám phá ngay
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </section>
  );
}
