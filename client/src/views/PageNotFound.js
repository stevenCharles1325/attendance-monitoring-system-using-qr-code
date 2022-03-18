export default function PagenotFound(){
  return(
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        color: 'white',

      }} 
      className="bg-dark d-flex flex-column justify-content-center align-items-center"
    >
      <div style={{ border: '4px solid white' }} className="p-5">
        <h1>
          404
        </h1>
        <h3>Page Not Found!</h3>
      </div>
    </div>
  );
}