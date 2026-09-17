import { WHY_US_FEATURES } from '../../utils/constants';

export function WhyUsSection() {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Tại sao chọn YLAN?</h2>
            <p className="text-primary-100 text-lg mb-8 opacity-90 leading-relaxed">
              Chúng tôi tin rằng làn da khỏe mạnh bắt nguồn từ sự hiểu biết đúng đắn. Không chạy theo xu hướng, chúng tôi mang đến những giá trị thực chất dựa trên nền tảng khoa học vững chắc.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {WHY_US_FEATURES.map((feature, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl mb-2 border border-white/20">
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold text-lg">{feature.title}</h4>
                  <p className="text-sm opacity-80 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square md:aspect-[4/3] lg:aspect-square rounded-[2rem] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1500&auto=format&fit=crop" 
                alt="Laboratory research"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
