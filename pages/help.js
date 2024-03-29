import React, { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';

function Help() {

  const style = {
    wrapper:`bg-gradient-to-br pt-4 from-blue-400 to-indigo-800 font-readex`,
    back:`text-lg text-white font-medium flex flex-row w-1/12 items-center mx-4 cursor-pointer px-3 transition-colors duration-500 border-black border-2 border-dashed bg-black hover:bg-transparent rounded-3xl hover:roundedspan`,
  }

  const handleGoBack = () => {
    window.history.back();
  };

  const [accordion, setAccordion] = useState([
    {
      question: ' How do I request a ride?',
      answer:
        'To request a ride, open the cryptoRide app and enter your destination. The app will show you the available ride options and their estimated arrival times. Just tap the one you want and confirm your pickup location.',
        isOpen: false
    },
    {
      question: 'How do I pay for my ride?',
      answer:
        'Payment is automatic and secure with your credit or debit card on file. You can also add or update payment methods in the app.',
        isOpen: false
    },
    {
      question: 'What if I have an issue during my ride?',
      answer:
        "If you have an issue during your ride, you can contact your driver or cryptoRide support through the app.",
        isOpen: false
    },
    {
      question: 'How do I rate my driver?',
      answer:
        'After your ride, you can rate your driver and provide feedback on your experience. Just go to the cryptoRide app menu and select "Your Trips". Then, select the trip you want to rate and provide your feedback.',
        isOpen: false
    },
    {
      question: 'How do I contact cryptoRide support?',
      answer:
        'You can contact cryptoRide support through the app or by visiting the cryptoRide Help Center. To contact support through the app, go to the cryptoRide app menu and select "Help". Then, select the issue you-re having and follow the prompts. If you prefer to contact support through the web, you can visit the cryptoRide Help Center at help.cryptocryptoRide.com.',
        isOpen: false
    },
    {
      question: 'How do I apply to be a cryptoRide driver?',
      answer:
        'If you-re interested in becoming a cryptoRide driver, you can apply through the cryptoRide app or website. Just go to the "Drive with cryptoRide" section of the app or visit the cryptoRide website at cryptocryptoRide.com/drive.',
        isOpen: false
    },
    {
      question: 'How do I cancel a ride?',
      answer:
        'To cancel a ride, open the cryptoRide app and select the trip you want to cancel. Then, tap "Cancel Ride" and follow the prompts.',
        isOpen: false
    },
    {
      question: 'How do I check my ride history?',
      answer:
        'To view your ride history, open the cryptoRide app and go to the "Your Trips" section. Here, you can see a list of all your past trips and their details.',
        isOpen: false
    },
    {
      question: ' How can I book a car through the app',
      answer:
        'To book a car through the app, first sign up for an account and provide your personal and payment information. Then, select your pickup and drop-off locations, along with the date and time you need the car. You can choose from available car options and complete the booking process.',
        isOpen: false
    },
    {
      question: ' What types of cars are available?',
      answer:
        'The types of cars available for rent may vary depending on the company and location. Generally, you can choose from economy, compact, midsize, full-size, luxury, and SUVs.',
        isOpen: false
    },
    {
      question: '  How do I modify my booking?',
      answer:
        'If you need to modify your booking, you can do so through the app. The modifications may be subject to availability and additional fees.',
        isOpen: false
    },
    {
      question: 'Can I book a car for someone else?',
      answer:
        "Yes, you can book a car for someone else, as long as you provide their information and they meet the rental car company's requirements.",
        isOpen: false
    },
    
]);

  
  const toggleAccordion = (index) => {
    
    setAccordion(
      accordion.map((item, i) =>
        i === index ? { ...item, isOpen: !item.isOpen } : { ...item, isOpen: false }
      )
    );
  };

  return (
    <div className={style.wrapper}>
    
    <div className="max-w-screen-xl mx-auto px-5 bg-gradient-to-br from-blue-400 to-indigo-800 min-h-screen">
    <span className={style.back} onClick={handleGoBack}><IoIosArrowBack/>Back</span>
      <div className="flex flex-col items-center">
        <h2 className="font-bold text-5xl mt-5 tracking-tight">FAQs</h2>
        <p className=" text-2xl mt-3 text-center">Frequently asked questions</p>
      </div>
      <div className="grid divide-y divide-neutral-900 max-w-2xl mx-auto mt-8">
        {accordion.map((item, index) => (
          <div className="py-5" key={index}>
            <details className="group" open={item.isOpen} onClick={() => toggleAccordion(index)}>
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span className='font-bold'>{item.question}</span>
                <span className="transition transform group-open:rotate-180">
                  <svg
                    fill="none"
                    height="24"
                    shapeRendering="geometricPrecision"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </summary>
              <p className=" mt-3 group-open:animate-fadeIn text-gray-200">{item.answer}</p>
            </details>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default Help;
