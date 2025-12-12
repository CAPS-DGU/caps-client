import React, { useEffect } from 'react';
import Slider from '../components/MainPage/Slider';
import Grid from '../components/MainPage/Grid';
import ContactUs from '../components/MainPage/ContactUs';
import About from '../components/MainPage/About';
import { useNavigate } from 'react-router-dom';
const MainPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/wiki');
  }, []);

  return (
    <>
      <Slider />
      <Grid />
      <ContactUs />
      <About />
    </>
  );
};

export default MainPage;
