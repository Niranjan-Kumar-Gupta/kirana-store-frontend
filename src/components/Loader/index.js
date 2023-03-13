import './index.css';
function Loader({visible}) {
    return visible?( 
        <div className=''>
        <div className='overlay'>
        <div className="loader">
                <div className="segment-holder">
                <div className="segment one"></div>  
                </div>
                <div className="segment-holder">
                <div className="segment two"></div>  
                </div>
                <div className="segment-holder">
                <div className="segment three"></div>  
                </div>
                <div className="segment-holder">
                <div className="segment four"></div>  
                </div>
        </div>
        </div>
        </div>
     ):<></>;
}

export default Loader;