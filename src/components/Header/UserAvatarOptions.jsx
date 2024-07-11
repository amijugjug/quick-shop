import Dropdown from '../atoms/Dropdown';

import UserAvatar from '../../static/assets/user-avatar.svg';
import { logout, verifySession } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../services/helpers/storageHelpers/cookie.helper';
import { useToast } from '../../context/Toast.context';

const UserAvatarOptions = () => {
  const navigate = useNavigate();
  const { notify } = useToast();

  const onSelect = (option) => {
    if (option.value === 'Logout') {
      logout(navigate);
      notify('success', 'You have been logged out');
    }
    if (option.value === 'Dashboard') {
      const username = getCookie('token');
      navigate(`/profile/${username}`);
    }
  };

  const options = [
    { label: 'Dashboard', value: 'Dashboard' },
    { label: 'Logout', value: 'Logout' },
  ];
  return (
    <Dropdown
      options={options}
      onSelect={onSelect}
      placeholder="User"
      placeholderImage={UserAvatar}
      onDropDownClick={verifySession}
    />
  );
};

export default UserAvatarOptions;
