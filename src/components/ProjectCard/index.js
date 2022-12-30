import {ListItem, Card, ProjectImage, Name} from './styledComponents'

const ProjectCard = props => {
  const {projectDetails} = props
  const {imageUrl, name} = projectDetails

  return (
    <ListItem>
      <Card>
        <ProjectImage alt={name} src={imageUrl} />
        <Name>{name}</Name>
      </Card>
    </ListItem>
  )
}

export default ProjectCard
