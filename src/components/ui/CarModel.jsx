import Spline from '@splinetool/react-spline';
import React, { useEffect, useRef } from 'react';

const CarModel = () => {
  const splineRef = useRef(null);
  const carObjectRef = useRef(null);

  const rotateModel = () => {
    if (carObjectRef.current) {
      carObjectRef.current.rotation.y += 0.01; // Adjust speed if needed
      requestAnimationFrame(rotateModel);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (carObjectRef.current) {
        if (window.innerWidth < 768) {
          carObjectRef.current.scale.x = 0.9;
          carObjectRef.current.scale.y = 0.9;
          carObjectRef.current.scale.z = 0.9;
        } else {
          carObjectRef.current.scale.x = 1;
          carObjectRef.current.scale.y = 1;
          carObjectRef.current.scale.z = 1;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center relative">
      <Spline
        scene="https://prod.spline.design/GbmhlHnea0iwyKpH/scene.splinecode"
        className="pointer-events-none select-none touch-none"
        onLoad={(spline) => {
          splineRef.current = spline;

          const car = spline.findObjectByName('Car');
          if (car) {
            carObjectRef.current = car;
            rotateModel();

            if (window.innerWidth < 768) {
              car.scale.x = 0.9;
              car.scale.y = 0.9;
              car.scale.z = 0.9;
              car.position.y = -40; // Move up on mobile
            }
          }
        }}
      />
      <div className="absolute bottom-0 right-3 bg-white opacity-100 w-40 h-[60px]"></div>
    </div>
  );
};

export default CarModel;
