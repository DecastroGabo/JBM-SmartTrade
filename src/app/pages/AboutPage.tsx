import { Award, Users, TrendingUp, Shield, Target, Heart, Lightbulb } from 'lucide-react';

export function AboutPage() {
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

  const values = [
    {
      icon: <Target className="w-12 h-12" />,
      title: 'Excellence',
      description: 'We are committed to excellence in everything we do, from product selection to customer service.'
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: 'Integrity',
      description: 'We conduct our business with honesty, transparency, and ethical practices.'
    },
    {
      icon: <Lightbulb className="w-12 h-12" />,
      title: 'Innovation',
      description: 'We continuously seek new and better ways to serve our customers and improve our offerings.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-800 dark:to-red-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About JBM Trading Company
          </h1>
          <p className="text-xl text-red-100 dark:text-red-200 max-w-3xl mx-auto">
            Your trusted partner for quality school, office, and hygiene supplies
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-foreground mb-6 text-center">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-600 dark:text-muted-foreground space-y-4">
            <p>
              With years of experience in the supply industry, JBM Trading Company has established itself as a reliable partner for schools, offices, and institutions. We pride ourselves on delivering quality products and exceptional service to our valued customers.
            </p>
            <p>
              Founded on the principles of quality, reliability, and customer satisfaction, we have grown from a small local supplier to a trusted name serving hundreds of clients across the region. Our success is built on understanding our customers' needs and consistently exceeding their expectations.
            </p>
            <p>
              Today, we continue to expand our product range and improve our services, always staying true to our commitment of providing the best supplies at competitive prices with unmatched customer service.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-card">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-foreground mb-12 text-center">
            What Sets Us Apart
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-background p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center border border-gray-200 dark:border-border"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                    <Icon className="text-red-600 dark:text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-foreground mb-12 text-center">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-red-600 dark:text-primary flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}