// Styles
import './LumexSpinner.scss';

// Components
import { Spinner } from 'react-bootstrap';

export const LumexSpinner = () => {
  return (
    <>
      <div className="spinner-wrapper">
        <Spinner className="lumex-spinner" animation="border" />
      </div>
      <div className="nav-bg-overlay"></div>
    </>
  );
};

export default LumexSpinner;
