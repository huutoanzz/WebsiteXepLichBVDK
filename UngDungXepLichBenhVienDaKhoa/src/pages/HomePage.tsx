import { Carousel } from 'primereact/carousel';

const HomePage = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-6 text-center text-blue-600">Hệ thống Quản lý Lịch Trực</h2>
      
      <p className="text-lg text-gray-700 text-center mb-8">
        Ứng dụng giúp quản lý lịch trực hiệu quả, dễ dàng và thuận tiện cho bệnh viện.
      </p>

      {/* Slideshow Section */}
      <div className="container mx-auto p-8 mb-8">
        <Carousel
          value={[
            '/images/slideshow1.jpg',
            '/images/slideshow2.png',
            '/images/slideshow3.jpg',
            '/images/slideshow4.jpg',
          ]}
          itemTemplate={(image) => (
            <div className="w-full h-full flex justify-center items-center">
              <img src={image} alt="Slide" className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-500 ease-in-out transform hover:scale-105" />
            </div>
          )}
          className="max-w-screen-lg mx-auto rounded-lg overflow-hidden shadow-lg"
          autoplayInterval={3000} 
          circular
          numVisible={1}
        />
      </div>

      {/* Section: Tính năng chính */}
      <div className="bg-white p-6 shadow-md rounded-lg mb-8">
        <h3 className="text-2xl font-semibold text-blue-500 mb-4">Tính năng chính</h3>
        <ul className="space-y-4 text-gray-600">
          <li>✔️ Quản lý lịch trực cho bác sĩ </li>
          <li>✔️ Điều chỉnh, cập nhật lịch trực dễ dàng</li>
          <li>✔️ Giao diện trực quan, dễ sử dụng</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
