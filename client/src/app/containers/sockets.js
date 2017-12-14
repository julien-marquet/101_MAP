import {connect} from 'react-redux'
import Sockets from '../components/Sockets'
import {USERS_GETTED} from '../actions/users';

const mapStateToProps = state => {
  return {
    ...state
  };
};

const mapDispatchToProps = dispatch => {
  return {
      storeUsers: payload => dispatch({type: USERS_GETTED, payload})
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sockets);
