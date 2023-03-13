import { Text } from "../components/Text";
import  versionData from '../utils/appVersion';

function VersionTag({color}) {
    return (
        <> 
        <Text type="sub-heading" color={color}>Powered by <span style={{ color: "#30B3D5", textDecoration: "underline" }}>Deskala</span></Text>
        <Text type="small-text" color={color}>Version {versionData.version} Launch date {versionData.date}</Text>
        </> );
}

export default VersionTag;