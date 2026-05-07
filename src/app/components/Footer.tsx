import { Shield, Award } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-red-500">JBM Trading Company</h3>
            <p className="text-gray-400 mb-4 max-w-2xl">
              Your trusted B2B partner for quality school supplies, office supplies, and hygiene products. 
              We deliver excellence with every order, serving institutions and businesses nationwide.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Shield className="w-5 h-5 text-red-500" />
              <span>Secure Transactions</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Award className="w-5 h-5 text-red-500" />
              <span>Quality Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 dark:border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2026 JBM Trading Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}