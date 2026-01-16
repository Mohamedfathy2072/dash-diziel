import { PrimaryBox } from "../mui/boxes/PrimaryBox"
import { PrimaryContainer } from "../mui/containers/PrimaryContainer"
import NotFoundSection from "../sections/NotFoundSection/NotFoundSection"

const NotFound = () => {
  return (
    <PrimaryBox>
      <PrimaryContainer>
        <NotFoundSection />
      </PrimaryContainer>
    </PrimaryBox>
  )
}

export default NotFound;
