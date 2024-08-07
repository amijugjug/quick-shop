import PropTypes from 'prop-types';

import s from './Button.module.css';

const Button = ({
  text,
  onClick,
  disabled = false,
  size = 'medium',
  align = 'center',
  backgorundColor = '',
}) => {
  const getSizeClass = (size) => {
    switch (size) {
      case 'large':
        return { width: '100%' };
      case 'medium':
        return { width: '111px' };
      case 'small':
        return { width: '80px' };
      case 'rounded':
        return { width: '32px', height: '32px', borderRadius: '50%' };
      default:
        return '';
    }
  };
  return (
    <button
      className={`${s.button} ${disabled ? s.buttonDisabled : ''}`}
      onClick={onClick}
      disabled={disabled}
      style={{
        alignSelf: align,
        background: backgorundColor,
        ...getSizeClass(size),
      }}
    >
      <span
        className={`${s.buttonText} ${size === 'small' ? s.buttonTextSmall : ''}`}
      >
        {text}
      </span>
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['large', 'medium', 'small', 'rounded']),
  align: PropTypes.string,
  backgorundColor: PropTypes.string,
};

export default Button;
