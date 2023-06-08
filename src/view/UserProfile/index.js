import CustomBreadcrumb from "../../components/CustomBreadcrumb";
import { useSelector } from "react-redux";
import { Text } from '../../components/Text'
import { useEffect } from "react";
import { API_GET_USER_PROFILE } from "../../api/user.service";
import { useState } from "react";

const itemslist=[{ label: 'User Profile', url: '/userprofile'  }, ];
const UserProfile = () => {
 
  const {user} = useSelector(state => state.authenticate);
  
  const [userProfile,setUserProfile] = useState(null)


  useEffect(()=>{ 
    const getUserProfile = async()=>{
      const userProfileData = await API_GET_USER_PROFILE(user.id)
      console.log(userProfileData)
      setUserProfile(userProfileData)
    }
    getUserProfile()
  },[])
 
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
                {userProfile?.userName}
                </Text>
              </div>
           </div>

           <div className="flex mb-3">
              <div>
                <Text type={'heading'}>Email :
                </Text>
              </div>
              <div className="ml-1">
                <Text>
                {userProfile?.email}
                </Text>
              </div>
           </div>

           <div className="flex mb-3">
              <div>
                <Text type={'heading'}>Phone :
                </Text>
              </div>
              <div className="ml-1">
                <Text>
                {userProfile?.phone}
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
                {userProfile?.companyId}
                </Text>
              </div>
           </div>

           <div className="flex ">
              <div>
                <Text type={'heading'}>Outlet Id :
                </Text>
              </div>
              <div className="ml-1">
                <Text>
                {userProfile?.outletId}
                </Text>
              </div>
           </div>
        </div>

      </div>
    
  )
}

export default UserProfile