import { useState } from 'react';
import { FileText, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function SpecificOrderPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [orderDetails, setOrderDetails] = useState('');
  const [quantity, setQuantity] = useState(1); // Added quantity state
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      setTimeout(() => setShowAuthPrompt(false), 3000);
      return;
    }

    if (orderDetails.length < 50) return;

    setIsSubmitting(true);

    try {
      // 1. Send data to your PHP Backend
      const response = await fetch('/api/submit-special-order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important: Sends the user's session cookie
        body: JSON.stringify({
          description: orderDetails.trim(),
          quantity: quantity
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowSuccess(true);
        setOrderDetails('');
        // 2. Redirect to the orders history page
        setTimeout(() => {
          navigate('/orders');
        }, 2500);
      } else {
        alert(result.message || "Failed to submit request.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Network error. Please check if your XAMPP server is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-gray-700 dark:text-foreground hover:text-red-600 dark:hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </button>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 p-4 rounded-lg">
              <FileText className="w-10 h-10 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-foreground">
                Custom / Specific Order
              </h1>
              <p className="text-lg text-gray-600 dark:text-muted-foreground mt-1">
                Request products not listed in our catalog
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 animate-fade-in">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <CheckCircle className="w-6 h-6" />
              <p className="font-semibold">Special order submitted successfully!</p>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              We'll review your request and contact you with a quote shortly. Redirecting to your orders...
            </p>
          </div>
        )}

        {/* Auth Prompt */}
        {showAuthPrompt && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 animate-fade-in">
            <p className="text-yellow-800 dark:text-yellow-200 font-semibold">
              Please sign in to submit a special order
            </p>
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => navigate('/login')}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-white dark:bg-card text-yellow-800 dark:text-foreground px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors text-sm font-medium border border-yellow-200 dark:border-border"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-card rounded-lg shadow-lg border border-gray-200 dark:border-border p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 dark:text-foreground mb-2">
                Order Details *
              </label>
              <textarea
                id="orderDetails"
                value={orderDetails}
                onChange={(e) => setOrderDetails(e.target.value)}
                placeholder="Example: I need 50 units of industrial-grade safety helmets..."
                className="w-full min-h-[250px] px-4 py-3 border border-gray-300 dark:border-border rounded-lg focus:ring-2 focus:ring-red-600 dark:bg-secondary dark:text-foreground"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 dark:text-foreground mb-2">
                Approximate Quantity Needed *
              </label>
              <input 
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full md:w-48 px-4 py-2 border border-gray-300 dark:border-border rounded-lg dark:bg-secondary"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || orderDetails.length < 50}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-4 rounded-lg hover:from-orange-600 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 font-semibold text-lg"
            >
              {isSubmitting ? "Submitting Request..." : "Submit Special Order Request"}
              {!isSubmitting && <Send size={20} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}