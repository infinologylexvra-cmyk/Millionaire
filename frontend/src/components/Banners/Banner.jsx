const Banner = ({ src, alt = 'Banner', className = '' }) => {
  if (!src) return null;
  return (
    <div className={`w-full overflow-hidden rounded-xl ${className}`}>
      <img src={src} alt={alt} className="w-full h-auto object-cover" />
    </div>
  );
};

export default Banner;
