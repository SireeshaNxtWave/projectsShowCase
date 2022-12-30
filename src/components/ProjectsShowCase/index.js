import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectCard from '../ProjectCard'
import {
  ProjectsBgContainer,
  HeaderCard,
  ProjectLogoImage,
  SelectElement,
  ResponsiveContainer,
  UnorderedList,
  NotFoundContainer,
  NotFoundImage,
  Heading,
  Description,
  Button,
} from './styledComponents'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiConstants = {
  initial: 'INITIAL',
  isLoading: 'ISLOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProjectsShowCase extends Component {
  state = {
    projectsList: [],
    selectOption: categoriesList[0].id,
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.renderProjectsList()
  }

  renderProjectsList = async () => {
    this.setState({apiStatus: apiConstants.isLoading})

    const {selectOption} = this.state
    const category = selectOption.toUpperCase()
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${category}`

    const response = await fetch(apiUrl)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))

      this.setState({
        projectsList: updatedData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div testid="loader">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => {
    const {projectsList} = this.state

    return (
      <UnorderedList>
        {projectsList.map(eachProject => (
          <ProjectCard key={eachProject.id} projectDetails={eachProject} />
        ))}
      </UnorderedList>
    )
  }

  onClickRetry = () => {
    this.renderProjectsList()
  }

  renderFailureView = () => {
    return (
      <NotFoundContainer>
        <NotFoundImage
          alt="failure view"
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        />
        <Heading>Oops! Something Went Wrong</Heading>
        <Description>
          We cannot seem to find the page you are looking for
        </Description>
        <Button type="button" onClick={this.onClickRetry}>
          Retry
        </Button>
      </NotFoundContainer>
    )
  }

  renderProjectsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiConstants.isLoading:
        return this.renderLoaderView()
      case apiConstants.success:
        return this.renderSuccessView()
      case apiConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  onChangeSelectOption = event => {
    this.setState({selectOption: event.target.value}, this.renderProjectsList)
  }

  render() {
    return (
      <ProjectsBgContainer>
        <HeaderCard>
          <ProjectLogoImage
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
          />
        </HeaderCard>
        <ResponsiveContainer>
          <SelectElement onChange={this.onChangeSelectOption}>
            {categoriesList.map(eachCategory => (
              <option key={eachCategory.id} value={eachCategory.id}>
                {eachCategory.displayText}
              </option>
            ))}
          </SelectElement>
          {this.renderProjectsView()}
        </ResponsiveContainer>
      </ProjectsBgContainer>
    )
  }
}

export default ProjectsShowCase
