import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { useState } from "react";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the form data to a server
    alert(
      "Thank you for your message! We will get back to you soon.",
    );
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-800 dark:to-red-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-red-100 dark:text-red-200 max-w-2xl mx-auto">
            Have questions or need a quote? Contact us today and
            our team will be happy to assist you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-6">
                Contact Information
              </h2>
              <p className="text-gray-600 dark:text-muted-foreground mb-8">
                We're here to help and answer any question you
                might have. We look forward to hearing from you!
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <Phone
                      className="text-red-600 dark:text-primary"
                      size={24}
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">
                      Phone
                    </h3>
                    <p className="text-gray-600 dark:text-muted-foreground">
                      +63 (917) 179-9401
                    </p>
                    
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <Mail className="text-red-600 dark:text-primary" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">
                      Email
                    </h3>
                    <p className="text-gray-600 dark:text-muted-foreground">
                      mctp@jbmtrading.biz
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <MapPin
                      className="text-red-600 dark:text-primary"
                      size={24}
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">
                      Address
                    </h3>
                    <p className="text-gray-600 dark:text-muted-foreground">
                      #132 Purok 3, Mataas Na Kahoy, Batangas
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <Clock
                      className="text-red-600 dark:text-primary"
                      size={24}
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">
                      Business Hours
                    </h3>
                    <div className="text-gray-600 dark:text-muted-foreground space-y-1">
                      <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 3:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-card p-8 rounded-lg shadow-lg border border-gray-200 dark:border-border">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-6">
                Send Us a Message
              </h2>
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-900 dark:text-foreground mb-2"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-border rounded-lg focus:ring-2 focus:ring-red-600 dark:focus:ring-primary focus:border-transparent bg-white dark:bg-background text-gray-900 dark:text-foreground"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-900 dark:text-foreground mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-border rounded-lg focus:ring-2 focus:ring-red-600 dark:focus:ring-primary focus:border-transparent bg-white dark:bg-background text-gray-900 dark:text-foreground"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-gray-900 dark:text-foreground mb-2"
                  >
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-border rounded-lg focus:ring-2 focus:ring-red-600 dark:focus:ring-primary focus:border-transparent bg-white dark:bg-background text-gray-900 dark:text-foreground"
                  >
                    <option value="">Select a subject</option>
                    <option value="School Supplies">
                      School Supplies Inquiry
                    </option>
                    <option value="Office Supplies">
                      Office Supplies Inquiry
                    </option>
                    <option value="Hygiene Supplies">
                      Hygiene Supplies Inquiry
                    </option>
                    <option value="Bulk Order">
                      Bulk Order Request
                    </option>
                    <option value="General">
                      General Inquiry
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-900 dark:text-foreground mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-border rounded-lg focus:ring-2 focus:ring-red-600 dark:focus:ring-primary focus:border-transparent resize-none bg-white dark:bg-background text-gray-900 dark:text-foreground"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 dark:bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="bg-gray-50 dark:bg-card py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-4">
            Looking for Bulk Orders?
          </h2>
          <p className="text-gray-600 dark:text-muted-foreground mb-6">
            We offer special pricing for bulk orders and
            long-term contracts. Contact our sales team to
            discuss your requirements and get a customized
            quote.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+639171799401"
              className="inline-flex items-center bg-red-600 dark:bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
            >
              <Phone className="mr-2" size={20} />
              Call Sales Team
            </a>
            <a
              href="mailto:mctp@jbmtrading.biz"
              className="inline-flex items-center bg-white dark:bg-background text-red-600 dark:text-primary border-2 border-red-600 dark:border-primary px-6 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-secondary transition-colors"
            >
              <Mail className="mr-2" size={20} />
              Email Sales Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}