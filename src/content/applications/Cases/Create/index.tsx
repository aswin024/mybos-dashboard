import React, { Fragment } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import moment from 'moment'
import { Myboscase } from '../../../../types'
import { createCase, uploadImage } from '../../../../services'
import RichEditor from '../RichEdiotor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWrench } from '@fortawesome/free-solid-svg-icons'
import { faPrint } from '@fortawesome/free-solid-svg-icons'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { faPaperclip } from '@fortawesome/free-solid-svg-icons'
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone'
import Photo from '../Photo'

import {
  InputField,
  DateField,
  InfoLabel,
  Placeholder,
  MainContainer,
  GridContainer,
  FileuploadContainer,
  DropDown,
  InputWrapper,
  WhiteLabel,
  StyledButton,
  ButtonsContainer,
  HeadingLabel1,
  MainWrapper,
  BlueHeader,
  BlueLine,
  HorDiv,
  StyledDiv,
  Disabled,
  ImagesDiv,
  GridContainerPhoto,
  StyledDivSmall,
  HeadingLabel,
} from './Create.style'
import { makeStyles } from '@material-ui/styles'
import { Button, MenuItem, Modal } from '@material-ui/core'

import Select from 'react-select'

function rand() {
  return Math.round(Math.random() * 20) - 10
}
const Create: React.FC = () => {
  function getModalStyle() {
    const top = 50 + rand()
    const left = 50 + rand()

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    }
  }
  const handleClose = () => {
    setOpenModal(false)
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',

      backgroundColor: '#fff',
      boxShadow: 'none',
      padding: 4,
      outline: 'none',
    },
  }))

  const [modalStyle] = React.useState(getModalStyle)
  let navigate = useNavigate()

  const mock_case_types = [
    'Repair and Maintainance',
    'Requests',
    'Common Repairs',
    'Replacement',
    'Gardening',
    'Incident',
  ]
  const mock_priority = ['High', 'Low', 'Medium']
  const mock_status = [
    'New',
    'In Progress',
    'Completed',
    'Deleted',
    'Awaiting Invoice',
    'Awaiting Quote',
  ]
  const mock_job_area = ['common-asset', 'common-not-asset', 'private lot']
  const mock_category = ['clouido', 'common area', 'door']

  const mock_assets = [
    { value: 'BLDG-Plumbing', label: 'BLDG-Plumbing' },
    { value: 'BLDG-Toilets', label: 'BLDG-Toilets' },
    { value: 'BLDG-Rest', label: 'BLDG-Rest' },
  ]

  const mock_assigned_to = [
    { value: 'Ace hanndy andy', label: 'Ace hanndy andy' },
    { value: 'bradyos', label: 'bradyos' },
    { value: 'AZ-Electrician', label: 'AZ-Plumbing' },
    { value: 'Chummins', label: 'Chummins' },
  ]
  const mock_subject = ['Light out', 'bulb clean', 'pool clean']
  //moment(Yup.date()).format('dd//MM/YYYY'),

  const validationSchema = Yup.object().shape({
    case_type: Yup.string(),
    added_date: Yup.string(),
    due_date: Yup.string(),
    priority: Yup.string(),
    status: Yup.string(),
    job_area: Yup.string(),
    category: Yup.string(),
    asset_category: Yup.string(),
    assigned_to: Yup.string(),
    email_subject: Yup.string(),
    email_description: Yup.string(),
    notes: Yup.string(),
    logged_by: Yup.string(),
  })

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })

  const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: ' ' }],
    },
  ]

  const [openModal, setOpenModal] = React.useState(false)
  const [caseImages, setCaseImages] = React.useState([''])
  const [casenum, setCasenum] = React.useState(0)
  const [email_desc, setEmail_desc] = React.useState(initialValue)
  const [assignedTo, setAssignedTo] = React.useState([])
  const [asset, setAsset] = React.useState([])
  const [addedDate, setAddedDate] = React.useState(
    new Date().toISOString().substr(0, 10),
  )
  const [dueDate, setDueDate] = React.useState(
    new Date().toISOString().substr(0, 10),
  )

  React.useEffect(() => {
    setCasenum(Number(localStorage.getItem('max_case_number')) + 1)
    setAddedDate(new Date().toISOString().substr(0, 10))
    setDueDate(new Date().toISOString().substr(0, 10))
  }, [])

  const onEditorChange = (value) => {
    console.log('onEditorChange ====>', value)
    console.log('onEditorChange ====>', email_desc)
  }

  const removePhoto = async (e) => {
    const url = e.currentTarget.getAttribute('data-value1')
    const newArray = caseImages
    const index = newArray.indexOf(url)
    if (index > -1) {
      newArray.splice(index, 1)
    }
    setCaseImages(newArray)
    navigate('/bm/cases/create')
    console.log('caseImages ====>', caseImages)
    return true
  }

  const onImageUploaded = async (file): Promise<boolean> => {
    const res = await uploadImage(file)
    console.log('upload done ====>', res)
    setCaseImages([...caseImages, res.url])
    return false
  }

  const onAddedDateChange = (value: any) => {
    console.log('added date-----', value)
    const added_date = new Date(value).toISOString().substr(0, 10)
    setAddedDate(added_date)
  }

  const onDueDateChange = (value: any) => {
    console.log('added date-----', value)
    const due_date = new Date(value).toISOString().substr(0, 10)
    setDueDate(due_date)
  }

  const onAssignedChange = (value: any) => {
    console.log('assigned-----', value)
    setAssignedTo(value)
  }

  const onAssetChange = (value: any) => {
    console.log('setAsset-----', value)
    setAsset(value)
  }

  const createCSV = (arr: any[]) => {
    let csv = arr.map((item) => item.value).join(',')
    console.log('csv--->', csv)
    return csv
  }

  const onSubmit = (data: any) => {
    if (assignedTo.length > 0 && asset.length > 0) {
      data['due_date'] = dueDate
      data['added_date'] = addedDate
      data['assigned_to'] = createCSV(assignedTo)
      data['asset'] = createCSV(asset)
      console.log('caseImages---', caseImages)
      if (caseImages.length > 0) {
        data['images'] = caseImages
      }
      console.log('after---', data)

      createCase(data)
        .then((result: any) => {
          localStorage.setItem('max_case_number', String(result.case_number))
          navigate('/bm/cases/list')
        })
        .catch((error: any) => {
          console.log('error- form1->', error)
        })
    }
  }

  const onCancel = (data: any) => {
    navigate('/bm/cases/list')
  }

  const onAddAndReset = (data: any) => {
    if (assignedTo.length > 0 && asset.length > 0) {
      data['due_date'] = dueDate
      data['added_date'] = addedDate
      data['assigned_to'] = createCSV(assignedTo)
      data['asset'] = createCSV(asset)
      console.log('after---', data)

      createCase(data)
        .then((result: any) => {
          localStorage.setItem('max_case_number', String(result.case_number))
          navigate('/bm/cases/list')
        })
        .catch((error: any) => {
          console.log('error- form1->', error)
        })
    }
  }
  const classes = useStyles()

  return (
    <Fragment>
      <MainWrapper>
        <BlueHeader>
          <HorDiv>
            <FontAwesomeIcon color="white" icon={faWrench} />
            <WhiteLabel>Create Cases</WhiteLabel>
          </HorDiv>
          <HorDiv>
            <FontAwesomeIcon color="white" icon={faPrint} />
            <FontAwesomeIcon color="white" icon={faCog} />
          </HorDiv>
        </BlueHeader>
        <MainContainer>
          <GridContainer>
            <HeadingLabel>Case Information</HeadingLabel>
            <Placeholder />
          </GridContainer>
          <GridContainer>
            <HeadingLabel>Attachments</HeadingLabel>
            <StyledDivSmall
              color="primary"
              style={{ height: 20 }}
              onClick={() => setOpenModal(true)}
            >
              <FontAwesomeIcon color="white" icon={faPaperclip} />
            </StyledDivSmall>
            <Placeholder />
          </GridContainer>
        </MainContainer>
        <MainContainer>
          <div>
            <BlueLine />
          </div>
          <div>
            <BlueLine />
          </div>
        </MainContainer>
        <MainContainer>
          <GridContainer>
            <InfoLabel>Case Number</InfoLabel>
            <Disabled>{casenum}</Disabled>
            <InfoLabel>Case Type</InfoLabel>
            <DropDown id="case_type" {...register('case_type')}>
              {mock_case_types.map((option) => (
                <option>{option}</option>
              ))}
            </DropDown>

            <InfoLabel>Added</InfoLabel>

            <DateField
              value={addedDate}
              onChange={(e) => onAddedDateChange(e.target.value)}
              id="added_date"
              type="date"
            />
            <InfoLabel>Due Date</InfoLabel>

            <DateField
              value={dueDate}
              onChange={(e) => onDueDateChange(e.target.value)}
              id="due_date"
              type="date"
            />

            <InfoLabel>Priority</InfoLabel>
            <DropDown id="priority" {...register('priority')}>
              {mock_priority.map((option) => (
                <option>{option}</option>
              ))}
            </DropDown>
            <InfoLabel>Status</InfoLabel>
            <DropDown id="status" {...register('status')}>
              {mock_status.map((option) => (
                <option>{option}</option>
              ))}
            </DropDown>
          </GridContainer>
          <FileuploadContainer>
            <Modal onClose={handleClose} open={openModal}>
              <GridContainerPhoto style={modalStyle} className={classes.paper}>
                <Photo uploadImage={onImageUploaded} />
                <Photo uploadImage={onImageUploaded} />
                <Photo uploadImage={onImageUploaded} />
                <Photo uploadImage={onImageUploaded} />
                <Photo uploadImage={onImageUploaded} />
                <Photo uploadImage={onImageUploaded} />
                <Photo uploadImage={onImageUploaded} />
                <Photo uploadImage={onImageUploaded} />
                <Photo uploadImage={onImageUploaded} />
                <Photo uploadImage={onImageUploaded} />
              </GridContainerPhoto>
            </Modal>
            <GridContainer>
              {caseImages
                .filter((url) => url !== '')
                .map((url, index) => (
                  <div key={index}>
                    <img height={150} width={150} src={url} />
                    <Button onClick={removePhoto} data-value1={url}>
                      <DeleteTwoToneIcon fontSize="small" />
                    </Button>
                  </div>
                ))}
            </GridContainer>
          </FileuploadContainer>
        </MainContainer>
        <MainContainer>
          <GridContainer>
            <HeadingLabel>Asset Information</HeadingLabel>
            <Placeholder />
          </GridContainer>
          <GridContainer>
            <HeadingLabel></HeadingLabel>
            <Placeholder />
          </GridContainer>
        </MainContainer>
        <MainContainer>
          <div>
            <BlueLine />
          </div>
          <div></div>
        </MainContainer>
        <MainContainer>
          <GridContainer>
            <InfoLabel>Job Area</InfoLabel>
            <DropDown id="job_area" {...register('job_area')}>
              {mock_job_area.map((option) => (
                <option>{option}</option>
              ))}
            </DropDown>

            <InfoLabel>Category</InfoLabel>
            <DropDown id="category" {...register('category')}>
              {mock_category.map((option) => (
                <option>{option}</option>
              ))}
            </DropDown>
            <InfoLabel>Asset</InfoLabel>
            <Select isMulti onChange={onAssetChange} options={mock_assets} />

            <InfoLabel>Assigned To</InfoLabel>
            <Select
              isMulti
              onChange={onAssignedChange}
              options={mock_assigned_to}
            />

            <InfoLabel>Subject</InfoLabel>
            <DropDown id="email_subject" {...register('email_subject')}>
              {mock_subject.map((option) => (
                <option>{option}</option>
              ))}
            </DropDown>
            <InfoLabel>Descrption</InfoLabel>
            <InputWrapper>
              <RichEditor
                onChange={onEditorChange}
                value={email_desc}
                setValue={setEmail_desc}
                {...register('email_description')}
              />
            </InputWrapper>

            <InfoLabel>Notes</InfoLabel>
            <InputField id="notes" {...register('notes')}></InputField>
          </GridContainer>
          <GridContainer></GridContainer>
        </MainContainer>

        <MainContainer>
          <GridContainer>
            <HeadingLabel1>Options</HeadingLabel1>
            <Placeholder />
          </GridContainer>
          <GridContainer>
            <HeadingLabel></HeadingLabel>
            <Placeholder />
          </GridContainer>
        </MainContainer>
        <MainContainer>
          <div>
            <BlueLine />
          </div>

          <div></div>
        </MainContainer>

        <MainContainer>
          <GridContainer>
            <HeadingLabel1>Logs</HeadingLabel1>
            <Placeholder />
          </GridContainer>
          <GridContainer>
            <HeadingLabel></HeadingLabel>
            <Placeholder />
          </GridContainer>
        </MainContainer>
        <MainContainer>
          <div>
            <BlueLine />
          </div>

          <div></div>
        </MainContainer>

        <MainContainer>
          <GridContainer>
            <HeadingLabel1>Email</HeadingLabel1>
            <Placeholder />
          </GridContainer>
          <GridContainer>
            <HeadingLabel></HeadingLabel>
            <Placeholder />
          </GridContainer>
        </MainContainer>
        <MainContainer>
          <div>
            <BlueLine />
          </div>

          <div></div>
        </MainContainer>

        <MainContainer>
          <GridContainer></GridContainer>
          <ButtonsContainer>
            <StyledDiv
              background={'000'}
              color={'fff'}
              onClick={handleSubmit(onCancel)}
            >
              Cancel
            </StyledDiv>

            <StyledDiv
              background={'d84937'}
              color={'fff'}
              disabled={assignedTo.length === 0 || asset.length === 0}
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </StyledDiv>

            <StyledDiv
              background={'d84937'}
              color={'fff'}
              disabled={assignedTo.length === 0 || asset.length === 0}
              onClick={handleSubmit(onAddAndReset)}
            >
              Save and Add New
            </StyledDiv>
          </ButtonsContainer>
        </MainContainer>
        <BlueHeader />
      </MainWrapper>
    </Fragment>
  )
}

export default Create