import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { PageHero } from '../components/PageHero';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      inquiryType: 'general'
    });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "danielinthelionsden72@gmail.com",
      action: "Send Email",
      link: "mailto:danielinthelionsden72@gmail.com"
    },
    {
      icon: Phone,
      title: "Phone",
      details: "(407) 461-6039",
      action: "Call Now",
      link: "tel:+14074616039"
    },
    {
      icon: MapPin,
      title: "Location",
      details: "Orlando, Florida",
      action: "Get Directions",
      link: "#"
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: "Mon-Fri: 9AM-5PM EST",
      action: "Schedule Meeting",
      link: "#"
    }
  ];

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'ministry', label: 'Ministry Services' },
    { value: 'music', label: 'Music & Booking' },
    { value: 'business', label: 'Business Services' },
    { value: 'prayer', label: 'Prayer Request' },
    { value: 'support', label: 'Technical Support' }
  ];

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <PageHero title="Contact Us" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Introduction */}
        <div className="relative text-center mb-12 sm:mb-16">
          <h2 className="responsive-heading-lg font-bold text-amber-500 mb-4 sm:mb-6">
            Get in Touch
          </h2>
          <p className="responsive-text-lg text-emerald-400 max-w-3xl mx-auto leading-relaxed">
            Whether you need ministry services, business solutions, or spiritual guidance, 
            we're here to serve you. Reach out and let's connect!
          </p>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="responsive-heading-md font-bold text-amber-500 mb-6 sm:mb-8">Contact Information</h3>
            
            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 sm:p-6 hover:border-amber-500/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-2 sm:p-3 bg-amber-500/20 rounded-full">
                      <info.icon size={20} className="sm:size-6 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-amber-500">{info.title}</h4>
                      <p className="text-gray-300 text-sm sm:text-base">{info.details}</p>
                    </div>
                  </div>
                  <a
                    href={info.link}
                    className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-medium transition-colors text-sm sm:text-base"
                  >
                    {info.action}
                    <Send size={14} className="sm:size-4" />
                  </a>
                </div>
              ))}
            </div>

            {/* Services Overview */}
            <div className="bg-gradient-to-r from-amber-500/10 to-green-500/10 border border-amber-500/30 rounded-lg p-4 sm:p-6">
              <h4 className="text-lg sm:text-xl font-bold text-amber-500 mb-4">Our Services</h4>
              <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                <li>• Ministry & Spiritual Guidance</li>
                <li>• Music Production & Performance</li>
                <li>• Website Development & Design</li>
                <li>• Commercial & Residential Cleaning</li>
                <li>• Community Outreach Programs</li>
                <li>• Prayer & Healing Ministry</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="responsive-heading-md font-bold text-amber-500 mb-6 sm:mb-8">Send Us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2.5 sm:p-3 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none text-sm sm:text-base"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2.5 sm:p-3 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none text-sm sm:text-base"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Inquiry Type */}
              <div>
                <label className="block text-sm font-medium text-amber-500 mb-2">
                  Inquiry Type
                </label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  className="w-full p-2.5 sm:p-3 bg-black/60 border border-green-500/30 rounded-lg text-white focus:border-amber-500 focus:outline-none text-sm sm:text-base"
                >
                  {inquiryTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-amber-500 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full p-2.5 sm:p-3 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none text-sm sm:text-base"
                  placeholder="Brief subject line"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-amber-500 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full p-2.5 sm:p-3 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none resize-none text-sm sm:text-base"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-black"></div>
                    <span className="hidden sm:inline">Sending...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle size={16} className="sm:size-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>

            {/* Response Time Notice */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <p className="text-sm text-green-300">
                <strong>Response Time:</strong> We typically respond within 24-48 hours. 
                For urgent matters, please call us directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}