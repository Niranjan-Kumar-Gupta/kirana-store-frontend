import CustomBreadcrumb from "../../components/CustomBreadcrumb";
import { useSelector } from "react-redux";
import { Text } from '../../components/Text'

const itemslist=[{ label: 'User Profile', url: '/userprofile'  }, ];
const UserProfile = () => {
 
  const {user} = useSelector(state => state.authenticate);

  console.log(user)
  return (
    
      <div className="w-11 pt-3 m-auto">
        <CustomBreadcrumb itemslist={itemslist}/>
        <div className="mt-5">
           <div className="flex mb-3">
              <div>
                <Text type={'heading'}>User Name :
                </Text>
              </div>
              <div className="ml-1">
                <Text>
                {user.userName}
                </Text>
              </div>
           </div>

           <div className="flex mb-3">
              <div>
                <Text type={'heading'}>Company Id
:
                </Text>
              </div>
              <div className="ml-1">
                <Text>
                {user.companyId}
                </Text>
              </div>
           </div>

           <div className="flex ">
              <div>
                <Text type={'heading'}>Id :
                </Text>
              </div>
              <div className="ml-1">
                <Text>
                {user.id}
                </Text>
              </div>
           </div>
        </div>

      </div>
    
  )
}

export default UserProfile