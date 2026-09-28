import "./PageBackground.css";

function PageBackground({ children, className = "" }) {
  return (
    <div className={`page-background ${className}`}>
      <div className="page-background-image"></div>

      <div className="page-content">
        {children}
      </div>
    </div>
  );
}

export default PageBackground;