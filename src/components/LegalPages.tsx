import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';

export const PrivacyPolicy = () => {
  const { language } = useData();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-black text-[#500000] mb-8">{language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}</h1>
        <p className="text-gray-500 mb-12">{language === 'bn' ? 'সর্বশেষ আপডেট: ৪ জানুয়ারী, ২০২৬' : 'Last Updated: January 4, 2026'}</p>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{language === 'bn' ? '১. ভূমিকা' : '1. Introduction'}</h2>
            <p className="text-gray-600 leading-relaxed">
              {language === 'bn' 
                ? 'রিজকারা টেকে ("কোম্পানি", "আমরা", "আমাদের") স্বাগতম। আমরা আপনার ব্যক্তিগত তথ্য এবং গোপনীয়তার অধিকার রক্ষা করতে প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা নীতি ব্যাখ্যা করে যে আমরা কীভাবে আপনার তথ্য সংগ্রহ করি, ব্যবহার করি এবং রক্ষা করি যখন আপনি আমাদের ওয়েবসাইট পরিদর্শন করেন বা আমাদের সফটওয়্যার ডেভেলপমেন্ট পরিষেবাগুলির সাথে জড়িত হন।'
                : 'Welcome to Rizqara Tech ("Company", "we", "our", "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or engage with our software development services.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{language === 'bn' ? '২. আমরা যে তথ্য সংগ্রহ করি' : '2. Information We Collect'}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {language === 'bn'
                ? 'যখন আপনি কোট অনুরোধ করেন, পরামর্শের সময় নির্ধারণ করেন বা আমাদের পরিষেবার বিষয়ে আমাদের সাথে যোগাযোগ করেন তখন আমরা আপনার দেওয়া তথ্য সংগ্রহ করি।'
                : 'We collect information that you provide directly to us when you request a quote, schedule a consultation, or communicate with us regarding our services.'}
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              {language === 'bn' ? (
                <>
                  <li><strong>ব্যক্তিগত সনাক্তকরণ ডেটা:</strong> নাম, ইমেল ঠিকানা, ফোন নম্বর, চাকরির শিরোনাম এবং কোম্পানির নাম।</li>
                  <li><strong>প্রকল্পের বিবরণ:</strong> স্পেসিফিকেশন, ডিজাইন ফাইল, ব্যবসায়িক প্রয়োজনীয়তা এবং বাজেট সীমাবদ্ধতা।</li>
                  <li><strong>প্রযুক্তিগত ডেটা:</strong> আইপি ঠিকানা, ব্রাউজার টাইপ এবং অপারেটিং সিস্টেম।</li>
                </>
              ) : (
                <>
                  <li><strong>Personal Identification Data:</strong> Name, email address, phone number, job title, and company name.</li>
                  <li><strong>Project Details:</strong> Specifications, design files, business requirements, and budget constraints provided for project estimation.</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, and operating system when you visit our website.</li>
                </>
              )}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{language === 'bn' ? '৩. আমরা কিভাবে আপনার তথ্য ব্যবহার করি' : '3. How We Use Your Information'}</h2>
            <p className="text-gray-600 leading-relaxed">
              {language === 'bn' ? 'আমরা সংগৃহীত তথ্য ব্যবহার করি:' : 'We use the collected information to:'}
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
              {language === 'bn' ? (
                <>
                  <li>আমাদের সফটওয়্যার ডেভেলপমেন্ট পরিষেবা প্রদান, পরিচালনা এবং রক্ষণাবেক্ষণ করতে।</li>
                  <li>লেনদেন প্রক্রিয়া করতে এবং নিশ্চিতকরণ এবং চালান সহ সম্পর্কিত তথ্য পাঠাতে।</li>
                  <li>প্রকল্প আপডেট, প্রযুক্তিগত সহায়তা এবং প্রশাসনিক বার্তা সম্পর্কে আপনার সাথে যোগাযোগ করতে।</li>
                  <li>ব্যবহারকারীর প্রতিক্রিয়া এবং ব্যবহারের ধরণগুলির উপর ভিত্তি করে আমাদের ওয়েবসাইট এবং পরিষেবা অফারগুলি উন্নত করতে।</li>
                </>
              ) : (
                <>
                  <li>Provide, operate, and maintain our software development services.</li>
                  <li>Process transactions and send related information, including confirmations and invoices.</li>
                  <li>Communicate with you about project updates, technical support, and administrative messages.</li>
                  <li>Improve our website and service offerings based on user feedback and usage patterns.</li>
                </>
              )}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{language === 'bn' ? '৪. ডেটা নিরাপত্তা' : '4. Data Security'}</h2>
            <p className="text-gray-600 leading-relaxed">
              {language === 'bn'
                ? 'আমরা আপনার ব্যক্তিগত তথ্য রক্ষা করার জন্য উপযুক্ত প্রযুক্তিগত এবং সাংগঠনিক নিরাপত্তা ব্যবস্থা বাস্তবায়ন করি। তবে, মনে রাখবেন যে ইন্টারনেট ১০০% নিরাপদ নয়। যদিও আমরা আপনার ব্যক্তিগত তথ্য রক্ষা করার জন্য যথাসাধ্য চেষ্টা করব, আমাদের পরিষেবা থেকে তথ্যের আদান-প্রদান আপনার নিজের ঝুঁকিতে।'
                : 'We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our services is at your own risk.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{language === 'bn' ? '৫. যোগাযোগ করুন' : '5. Contact Us'}</h2>
            <p className="text-gray-600 leading-relaxed">
              {language === 'bn'
                ? 'এই নীতি সম্পর্কে আপনার কোন প্রশ্ন বা মন্তব্য থাকলে, আপনি আমাদের ইমেল করতে পারেন privacy@rizqaratech.com এ।'
                : 'If you have questions or comments about this policy, you may email us at privacy@rizqaratech.com.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export const TermsOfService = () => {
  const { language } = useData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-black text-[#500000] mb-8">{language === 'bn' ? 'সেবার শর্তাবলী' : 'Terms of Service'}</h1>
        <p className="text-gray-500 mb-12">{language === 'bn' ? 'সর্বশেষ আপডেট: ৪ জানুয়ারী, ২০২৬' : 'Last Updated: January 4, 2026'}</p>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{language === 'bn' ? '১. শর্তাবলী গ্রহণ' : '1. Acceptance of Terms'}</h2>
            <p className="text-gray-600 leading-relaxed">
              {language === 'bn'
                ? 'রিজকারা টেকের ওয়েবসাইট এবং পরিষেবাগুলি অ্যাক্সেস এবং ব্যবহার করে, আপনি এই চুক্তির শর্তাবলী এবং বিধান দ্বারা আবদ্ধ হতে সম্মত হন।'
                : 'By accessing and using the website and services of Rizqara Tech ("Company", "we", "us"), you accept and agree to be bound by the terms and provision of this agreement.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{language === 'bn' ? '২. সেবাসমূহ' : '2. Services'}</h2>
            <p className="text-gray-600 leading-relaxed">
              {language === 'bn'
                ? 'রিজকারা টেক কাস্টম সফটওয়্যার ডেভেলপমেন্ট, ওয়েব অ্যাপ্লিকেশন ডিজাইন এবং ডিজিটাল পরামর্শ পরিষেবা প্রদান করে। প্রতিটি প্রকল্পের নির্দিষ্ট কাজের পরিধি উভয় পক্ষের স্বাক্ষরিত একটি পৃথক প্রস্তাব বা মাস্টার সার্ভিসেস এগ্রিমেন্ট (MSA) এ সংজ্ঞায়িত করা হয়।'
                : 'Rizqara Tech provides custom software development, web application design, and digital consulting services. The specific scope of work for each project is defined in a separate proposal or Master Services Agreement (MSA) signed by both parties.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{language === 'bn' ? '৩. মেধা সম্পত্তি' : '3. Intellectual Property'}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {language === 'bn'
                ? <strong>আমাদের কন্টেন্ট: এই ওয়েবসাইটের কন্টেন্ট (টেক্সট, গ্রাফিক্স, লোগো, ছবি) রিজকারা টেকের সম্পত্তি এবং কপিরাইট আইন দ্বারা সুরক্ষিত।</strong>
                : <strong>Our Content: The content on this website (text, graphics, logos, images) is the property of Rizqara Tech and is protected by copyright laws.</strong>}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {language === 'bn'
                ? <strong>ক্লায়েন্ট প্রকল্প: সমস্ত ফি সম্পূর্ণ অর্থপ্রদানের পরে, রিজকারা টেক ক্লায়েন্টকে ক্লায়েন্টের জন্য বিশেষভাবে তৈরি করা কাস্টম সফটওয়্যার ডেলিভারিবলের সমস্ত অধিকার, শিরোনাম এবং স্বার্থ প্রদান করে, রিজকারা টেকের মালিকানাধীন কোনও ব্যাকগ্রাউন্ড প্রযুক্তি বা পূর্ব-বিদ্যমান মেধা সম্পত্তি ব্যতীত।</strong>
                : <strong>Client Projects: Upon full payment of all fees, Rizqara Tech assigns to the Client all right, title, and interest in the custom software deliverables created specifically for the Client, excluding any background technology or pre-existing intellectual property owned by Rizqara Tech.</strong>}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{language === 'bn' ? '৪. ব্যবহারকারীর বাধ্যবাধকতা' : '4. User Obligations'}</h2>
            <p className="text-gray-600 leading-relaxed">
              {language === 'bn'
                ? 'আপনি কোনও বেআইনি উদ্দেশ্যে ওয়েবসাইট বা আমাদের পরিষেবা ব্যবহার না করতে সম্মত হন। প্রকল্পের প্রয়োজনীয়তা বা প্রতিক্রিয়া প্রদান করার সময়, আপনি সম্মত হন যে আপনার আমাদের সাথে শেয়ার করা কোনও কন্টেন্ট বা উপকরণের জন্য প্রয়োজনীয় অধিকার এবং অনুমতি রয়েছে।'
                : 'You agree not to use the website or our services for any unlawful purpose. When providing project requirements or feedback, you agree that you have the necessary rights and permissions for any content or materials you share with us.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{language === 'bn' ? '৫. দায়বদ্ধতার সীমাবদ্ধতা' : '5. Limitation of Liability'}</h2>
            <p className="text-gray-600 leading-relaxed">
              {language === 'bn'
                ? 'রিজকারা টেক কোনও পরোক্ষ, আনুষঙ্গিক, বিশেষ, ফলস্বরূপ বা শাস্তিমূলক ক্ষতির জন্য দায়ী থাকবে না, যার মধ্যে সীমাবদ্ধতা ছাড়াই লাভের ক্ষতি, ডেটা, ব্যবহার, সদিচ্ছা বা অন্যান্য অদম্য ক্ষতি অন্তর্ভুক্ত, যা আপনার পরিষেবাগুলিতে অ্যাক্সেস বা ব্যবহার বা অ্যাক্সেস বা ব্যবহার করতে অক্ষমতা থেকে সৃষ্টি হয়।'
                : 'In no event shall Rizqara Tech be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the services.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{language === 'bn' ? '৬. শাসনকারী আইন' : '6. Governing Law'}</h2>
            <p className="text-gray-600 leading-relaxed">
              {language === 'bn'
                ? 'এই শর্তাবলী রিজকারা টেক যে এখতিয়ারে নিবন্ধিত সেই এখতিয়ারের আইন অনুসারে পরিচালিত এবং ব্যাখ্যা করা হবে।'
                : 'These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which Rizqara Tech is registered, without regard to its conflict of law provisions.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
