'use client';
import React, {useEffect} from 'react';
import Slider, {Settings} from 'react-slick';
import {ProgressSpinner} from 'primereact/progressspinner';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {useSliderContext} from '@/layout/context/SliderContext';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Keyboard, Mousewheel, Navigation, Pagination} from 'swiper/modules';
import 'swiper/swiper-bundle.css';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const Carousel = () => {
  const {data, loading, error, refreshData} = useSliderContext();

  useEffect(() => {
    refreshData();
  }, []);

  const settings: Settings = {
    dots: true,
    infinite: data.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    touchMove: true,
    draggable: true,
  };

  if (loading) return <ProgressSpinner style={{width: '50px', height: '50px'}}/>;
  if (error) return <div style={{color: 'red', textAlign: 'center'}}>{error}</div>;
  return data.length > 0 ? <Swiper
    navigation={true}
    pagination={true}
    keyboard={true}
    draggable={true}
    modules={[Navigation, Pagination, Mousewheel, Keyboard]}
    className="mySwiper"
  >
    {data.map((image, index) => (
      <SwiperSlide key={image.id}>
        <img
          src={`${baseUrl}${image.image}`}
          alt={image.title || 'تصویر'}
          style={{
            width: '100%',
            height: '400px',
            objectFit: 'fill',
          }}
        />
      </SwiperSlide>
    ))}
  </Swiper> : (
    <p>هیچ اسلایدی برای نمایش وجود ندارد.</p>

  )
  return data.length > 0 ? (
    <Slider {...settings}>
      {data.map((item) => (
        <div key={item.id}>
          <img
            src={`${baseUrl}${item.image}`}
            alt={item.title || 'تصویر'}
            style={{
              width: '100%',
              height: '400px',
              objectFit: 'fill',
            }}
          />
        </div>
      ))}
    </Slider>
  ) : (
    <p>هیچ اسلایدی برای نمایش وجود ندارد.</p>
  );
};

export default Carousel;
