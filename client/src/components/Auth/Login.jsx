import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { INPUT_TYPE, LOGIN_MODAL_TEXT } from '../../constants';
import { useToast } from '../../context/Toast.context';
import { login } from '../../services/auth.service';
import Button from '../atoms/Button';
import Input from '../Input';
import Modal from '../Modal';
import Portal from '../Portal';
// import { useModal } from '../../context/Modal.context';

const LoginComponent = () => {
  const [state, setState] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();
  const { notify } = useToast();

  const isButtonDisabled = () => state.username === '' || state.password === '';

  const handleSubmit = () => {
    login(
      { username: state.username, password: state.password },
      navigate,
      '/',
      notify
    );
  };

  const handleUsernameInputChange = (event) => {
    const username = event.target.value;

    setState({ ...state, username });
  };

  const handlePasswordInputChange = (event) => {
    const password = event.target.value;
    setState({ ...state, password });
  };

  return (
    <>
      <Input
        title={LOGIN_MODAL_TEXT.email.title}
        placeHolder={LOGIN_MODAL_TEXT.email.placeholder}
        type={INPUT_TYPE.TEXT}
        value={state.username}
        handleInputChange={handleUsernameInputChange}
      />
      <Input
        title={LOGIN_MODAL_TEXT.password.title}
        placeHolder={LOGIN_MODAL_TEXT.password.placeholder}
        type={INPUT_TYPE.PASSWORD}
        showEyeIcon={true}
        value={state.password}
        handleInputChange={handlePasswordInputChange}
      />
      <Button
        text={LOGIN_MODAL_TEXT.buttonText}
        onClick={handleSubmit}
        disabled={isButtonDisabled()}
        size="large"
      />
    </>
  );
};

const Login = () => {
  // const { modal } = useModal();
  // if (!modal) return;
  return (
    <Portal>
      <Modal
        props={{
          headerText: LOGIN_MODAL_TEXT.headerText,
          descriptionText: LOGIN_MODAL_TEXT.descriptionText,
          footerStatementText: LOGIN_MODAL_TEXT.footerStatementText,
          redirectionText: LOGIN_MODAL_TEXT.redirectionText,
          redirectionLink: '/register',
        }}
      >
        <LoginComponent />
      </Modal>
    </Portal>
  );
};

export default Login;
