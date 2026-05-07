import { Briefcase, Heart, Dumbbell, Armchair, GraduationCap } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

const categories = [
  {
    title: 'School Supplies',
    description: 'Educational supplies and resources for learning and development, from basic materials to advanced tools.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    icon: GraduationCap,
    items: ['Notebooks & Pens', 'Backpacks', 'Art Supplies', 'Calculators', 'Educational Tools']
  },
  {
    title: 'Office Supplies and Equipment',
    description: 'Professional office equipment and stationery to keep your workplace organized and productive, from basic supplies to premium items.',
    image: 'https://images.unsplash.com/photo-1675472574322-50633f897b2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBzdXBwbGllcyUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3Njg0NjM3MDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    icon: Briefcase,
    items: ['Copy Paper & Stationery', 'Writing Instruments', 'Desk Organizers', 'USB Drives & Tech', 'Printers & Planners']
  },
  {
    title: 'Medicine and Medical Supplies',
    description: 'Essential medical supplies and medicines for healthcare and safety. Including first aid kits, medications, and protective equipment.',
    image: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    icon: Heart,
    items: ['Medications & Vitamins', 'First Aid Kits', 'Protective Equipment', 'Medical Instruments', 'Wound Care Supplies']
  },
  {
    title: 'Sports Supplies and Equipment',
    description: 'Complete range of sports equipment and fitness supplies for staying active and healthy, from basic gear to professional equipment.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    icon: Dumbbell,
    items: ['Exercise Equipment', 'Sports Balls', 'Fitness Accessories', 'Training Gear', 'Yoga & Wellness']
  },
  {
    title: 'Furniture and Fixtures',
    description: 'Durable furniture and fixtures for professional environments and homes. Quality chairs, desks, storage solutions, and more.',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    icon: Armchair,
    items: ['Office Chairs', 'Desks & Tables', 'Storage Solutions', 'Lighting & Decor', 'Organizational Units']
  }
];

export function ProductCategories() {
  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Product Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our comprehensive range of supplies tailored to meet your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-md">
                    <Icon className="text-blue-600" size={24} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                  <ul className="space-y-2">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}