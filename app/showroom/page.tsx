"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Clock, Mail, MessageCircle, Navigation, Car, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const showroomData = {
  name: "Authentic Furniture Lagos Showroom",
  address: "No. 22b, Sunny Bus Stop, Olojo Drive, Alaba International Market, Ojo, Lagos, Nigeria",
  phone: "+234 903 777 25829",
  email: "authenticfurnituresltd@gmail.com",
  hours: {
    weekday: "9:00 AM - 7:00 PM",
    saturday: "10:00 AM - 6:00 PM",
    sunday: "Closed"
  },
  mapUrl: "https://maps.google.com/?q=No.+22b,+Sunny+Bus+Stop,+Olojo+Drive,+Alaba+International+Market,+Ojo,+Lagos,+Nigeria",
  features: [
    "Over 500+ furniture pieces on display",
    "Professional design consultation",
    "Custom furniture solutions",
    "Same-day delivery in Lagos",
    "Free parking available",
    "Wheelchair accessible"
  ]
};

export default function ShowroomPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    appointmentDate: '',
    appointmentTime: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Appointment request:', formData);
    // You can integrate with your backend here
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px]">
        <Image
          src="https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Authentic Furniture Showroom"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Visit Our Showroom</h1>
            <p className="text-xl md:text-2xl mb-6">Experience our furniture in person</p>
            <Button asChild size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold">
              <Link href="#contact" className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Book an Appointment
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Showroom Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Our Lagos Showroom</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Step into our spacious showroom and discover the perfect furniture for your home or office. 
                Our knowledgeable staff is here to help you find exactly what you're looking for.
              </p>
            </div>

            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Location & Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-600 mt-1" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Address</p>
                    <p className="text-slate-600 dark:text-slate-300">{showroomData.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Phone</p>
                    <a href={`tel:${showroomData.phone}`} className="text-blue-600 hover:underline">
                      {showroomData.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Email</p>
                    <a href={`mailto:${showroomData.email}`} className="text-blue-600 hover:underline">
                      {showroomData.email}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opening Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Opening Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Monday - Friday</span>
                    <span className="font-medium text-slate-900 dark:text-white">{showroomData.hours.weekday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Saturday</span>
                    <span className="font-medium text-slate-900 dark:text-white">{showroomData.hours.saturday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Sunday</span>
                    <span className="font-medium text-slate-900 dark:text-white">{showroomData.hours.sunday}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features & Amenities */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Showroom Features</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {showroomData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Quick Actions</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button asChild variant="outline" className="justify-start">
                  <a 
                    href={showroomData.mapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </a>
                </Button>
                
                <Button asChild variant="outline" className="justify-start">
                  <a 
                    href={`https://wa.me/23490377725829?text=Hi, I'd like to visit your showroom`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Us
                  </a>
                </Button>
                
                <Button asChild variant="outline" className="justify-start">
                  <a 
                    href={`tel:${showroomData.phone}`}
                    className="flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </a>
                </Button>
                
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/products" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Browse Online
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white text-center">Find Us on the Map</h3>
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.1234567890123!2d3.123456789012345!3d6.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMDcnMjQuNCJOIDPCsDA3JzI0LjQiRQ!5e0!3m2!1sen!2sng!4v1234567890123!5m2!1sen!2sng"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Authentic Furniture Showroom Location"
            ></iframe>
          </div>
        </div>

        {/* Appointment Form */}
        <div id="contact" className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Book an Appointment</CardTitle>
              <p className="text-center text-slate-600 dark:text-slate-300">
                Schedule a visit to our showroom for a personalized consultation
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+234 XXX XXX XXXX"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="appointmentDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Preferred Date
                    </label>
                    <Input
                      id="appointmentDate"
                      name="appointmentDate"
                      type="date"
                      value={formData.appointmentDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your furniture needs or any specific questions..."
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Book Appointment
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
