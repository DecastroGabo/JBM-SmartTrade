import { Award, Users, TrendingUp, Shield } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Quality Products',
    description: 'We source only the finest products from trusted manufacturers to ensure customer satisfaction.'
  },
  {
    icon: Users,
    title: 'Customer Focused',
    description: 'Our dedicated team works closely with clients to understand and meet their specific needs.'
  },
  {
    icon: TrendingUp,
    title: 'Competitive Pricing',
    description: 'We offer excellent value without compromising on quality, with flexible bulk ordering options.'
  },
  {
    icon: Shield,
    title: 'Reliable Service',
    description: 'On-time delivery and consistent product availability you can count on.'
  }
];

export function About() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About JBM Trading Company
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            With years of experience in the supply industry, JBM Trading Company has established itself as a reliable partner for schools, offices, and institutions. We pride ourselves on delivering quality products and exceptional service to our valued customers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Icon className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-blue-600 text-white rounded-lg p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Why Choose JBM Trading Company?
          </h3>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            We understand that reliable supply partners are essential to your operations. Whether you're managing a school, running an office, or overseeing a facility, we provide the products and service you need to succeed.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Products Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
