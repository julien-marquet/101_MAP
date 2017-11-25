import {connect} from 'react-redux'
import Warzone from '../components/Warzone'

const mapStateToProps = state => {
  return {
    ...state
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Warzone);
