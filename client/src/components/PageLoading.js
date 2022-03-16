import CircularProgress from '@mui/material/CircularProgress';

export default function Loading() {
  return(
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }} 
      className="d-flex justify-content-center align-items-center"
    >
      <CircularProgress/>
    </div>
  );
}