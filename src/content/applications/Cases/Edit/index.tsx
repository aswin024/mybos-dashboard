import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { updateCase, getCaseById, uploadImage } from '../../../../services'
import RichEditor from '../RichEditor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWrench } from '@fortawesome/free-solid-svg-icons'
import { faPrint } from '@fortawesome/free-solid-svg-icons'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { faPaperclip } from '@fortawesome/free-solid-svg-icons'
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone'
import Photo from '../Photo'
import { makeStyles } from '@material-ui/styles'
import Select from 'react-select'
import { Button, Modal } from '@material-ui/core'

import {
  InputField,
  DateField,
  InfoLabel,
  Placeholder,
  MainContainer,
  GridContainer,
  GridContainer1,
  FileuploadContainer,
  DropDown,
  InputWrapper,
  WhiteLabel,
  ButtonsContainer,
  HeadingLabel1,
  MainWrapper,
  BlueHeader,
  BlueLine,
  HorDiv,
  StyledDiv,
  StyledDivSmall,
  GridContainerPhoto,
  Disabled,
  HeadingLabel,
} from './Edit.style'

const Edit: React.FC = () => {
  function rand() {
    return Math.round(Math.random() * 20) - 10
  }
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

  const mock_apartments = [
    'Pick Appartments',
    '44',
    '375',
    '77',
    '56',
    '45',
    '66',
    '44',
    '375',
    '77',
    '56',
    '45',
    '66',
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

  const { register, handleSubmit, setValue } = useForm({
    resolver: yupResolver(validationSchema),
  })

  const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: ' ' }],
    },
  ]

  const [jobArea, setJobArea] = React.useState('common-asset')
  const [openModal, setOpenModal] = React.useState(false)
  const [caseImages, setCaseImages] = React.useState([''])
  const [casenum, setCasenum] = React.useState(0)
  const [email_desc, setEmail_desc] = React.useState(initialValue)
  const [notes, setNotes] = React.useState(initialValue)
  const [assignedTo, setAssignedTo] = React.useState([])
  const [asset, setAsset] = React.useState([])
  const [addedDate, setAddedDate] = React.useState(
    new Date().toISOString().substr(0, 10),
  )
  const [dueDate, setDueDate] = React.useState(
    new Date().toISOString().substr(0, 10),
  )
  const [caseId, setCaseId] = React.useState('')

  React.useEffect(() => {
    populateCase()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const prefillForm = (item: any) => {
    console.log('editing......', item)
    setCasenum(item.case_number)

    const added_date = new Date(item.added_date || new Date())
      .toISOString()
      .substr(0, 10)
    const due_date = new Date(item.due_date || new Date())
      .toISOString()
      .substr(0, 10)
    setAddedDate(added_date)
    setDueDate(due_date)

    if (item.assigned_to) {
      setAssignedTo(prepareMultiSelect(item.assigned_to))
    }
    if (item.asset) {
      setAsset(prepareMultiSelect(item.asset))
    }
    if (item.email_description) {
      setEmail_desc(JSON.parse(item.email_description))
    }

    if (item.notes) {
      setNotes(item.notes)
    }

    setCaseImages(item.images.filter((url) => url !== ''))

    setValue('case_type', item.case_type)
    setValue('priority', item.priority)
    setValue('status', item.status)
    if (item.job_area) {
      setJobArea(item.job_area)
      setValue('job_area', item.job_area)
      if (item.category) {
        setValue('category', item.category)
      }
    }

    setValue('email_subject', item.email_subject)
    setValue('logged_by', item.logged_by)
    setValue('add_to_report', item.add_to_report)
    setValue('duplicate_case', item.duplicate_case)
  }

  const prepareMultiSelect = (value: any) => {
    const items = value.split(',')
    const arr = items.map((item) => {
      return { value: item, label: item }
    })
    return arr
  }

  const populateCase = () => {
    const id = new URLSearchParams(window.location.search).get('id')
    setCaseId(id)

    getCaseById(id)
      .then((result: any) => {
        prefillForm(result)
      })
      .catch((error: any) => {
        navigate('/login')
      })
  }

  const onNotesChange = (event) => {
    setNotes(event.target.value)
  }

  const onImageUploaded = async (file): Promise<boolean> => {
    const res = await uploadImage(file)

    setCaseImages([...caseImages, res.url])
    return false
  }

  const removePhoto = async (e) => {
    const url = e.currentTarget.getAttribute('data-value1')
    const newArray = caseImages
    const index = newArray.indexOf(url)
    if (index > -1) {
      newArray.splice(index, 1)
    }
    setCaseImages(newArray)
    navigate(`/bm/cases/edit?id=${caseId}`)
    return true
  }

  const onAddedDateChange = (value: any) => {
    const added_date = new Date(value).toISOString().substr(0, 10)
    setAddedDate(added_date)
  }

  const onDueDateChange = (value: any) => {
    const due_date = new Date(value).toISOString().substr(0, 10)
    setDueDate(due_date)
  }

  const onJobAreaChange = (e) => {
    let index = mock_job_area.indexOf(e.target.value)
    let template = mock_job_area[index]
    setJobArea(template)
  }

  const onAssignedChange = (value: any) => {
    setAssignedTo(value)
  }

  const onAssetChange = (value: any) => {
    setAsset(value)
  }

  const createCSV = (arr: any[]) => {
    let csv = arr.map((item) => item.value).join(',')
    return csv
  }

  const onSubmit = (data: any) => {
    if (assignedTo.length > 0 && asset.length > 0) {
      data['added_date'] = addedDate
      data['due_date'] = dueDate
      data['assigned_to'] = createCSV(assignedTo)
      data['asset'] = createCSV(asset)
      data['id'] = caseId
      data['email_description'] = JSON.stringify(email_desc)
      data['notes'] = notes
      if (caseImages.length > 0) {
        data['images'] = caseImages
      }
      updateCase(data)
        .then((result: any) => {
          navigate('/bm/cases/list')
        })
        .catch((error: any) => {})
    }
  }

  const onCancel = (data: any) => {
    navigate('/bm/cases/list')
  }

  const classes = useStyles()
  const jobAreaFiled = register('job_area')

  return (
    <div
      style={{
        marginTop: 20,
        border: '1px solid #eee',
        width: '95%',
        marginLeft: 8,
        marginRight: 8,
      }}
    >
      <MainWrapper>
        <BlueHeader>
          <HorDiv>
            <FontAwesomeIcon color="white" icon={faWrench} />
            <WhiteLabel>Edit Case</WhiteLabel>
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
          <GridContainer1>
            <HeadingLabel>Attachments</HeadingLabel>
            <StyledDivSmall
              color="primary"
              style={{ height: 20 }}
              onClick={() => setOpenModal(true)}
            >
              <FontAwesomeIcon color="white" icon={faPaperclip} />
            </StyledDivSmall>
          </GridContainer1>
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
            <InfoLabel bold={true}>Case Number</InfoLabel>
            <Disabled>{casenum}</Disabled>
            <InfoLabel>Case Type</InfoLabel>
            <DropDown id="case_type" {...register('case_type')}>
              {mock_case_types.map((option) => (
                <option key={option}>{option}</option>
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
                <option key={option}>{option}</option>
              ))}
            </DropDown>
            <InfoLabel>Status</InfoLabel>
            <DropDown id="status" {...register('status')}>
              {mock_status.map((option) => (
                <option key={option}>{option}</option>
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
                    <img alt="case" height={150} width={150} src={url} />
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
            <DropDown
              id="job_area"
              {...jobAreaFiled}
              onChange={(e) => {
                jobAreaFiled.onChange(e)
                onJobAreaChange(e)
              }}
            >
              {mock_job_area.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </DropDown>
            {jobArea !== 'common-not-asset' && (
              <>
                <InfoLabel>Category</InfoLabel>
                {jobArea === 'common-asset' ? (
                  <DropDown id="category" {...register('category')}>
                    {mock_category.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </DropDown>
                ) : (
                  <DropDown id="category" {...register('category')}>
                    {mock_apartments.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </DropDown>
                )}

                <InfoLabel>Asset</InfoLabel>
                <Select
                  isMulti
                  onChange={onAssetChange}
                  options={mock_assets}
                />
              </>
            )}
            <InfoLabel>Assigned To</InfoLabel>
            <InputWrapper>
              <Select
                value={assignedTo}
                isMulti
                onChange={onAssignedChange}
                options={mock_assigned_to}
              />
            </InputWrapper>

            <InfoLabel>Subject</InfoLabel>
            <DropDown id="email_subject" {...register('email_subject')}>
              {mock_subject.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </DropDown>
            <InfoLabel>Descrption</InfoLabel>
            <InputWrapper>
              <RichEditor
                value={email_desc}
                setValue={setEmail_desc}
                {...register('email_description')}
              />
            </InputWrapper>

            <InfoLabel>Notes</InfoLabel>

            <InputField onChange={onNotesChange} value={notes}></InputField>
          </GridContainer>
          <GridContainer></GridContainer>
        </MainContainer>

        <MainContainer>
          <GridContainer>
            <HeadingLabel1>Options</HeadingLabel1>
            <Placeholder />
          </GridContainer>
          <GridContainer1></GridContainer1>
          <GridContainer1>
            <InfoLabel style={{ marginLeft: 10 }}>
              Add this case to management report?
            </InfoLabel>
            <input
              type="checkbox"
              id="add_to_report"
              {...register('add_to_report')}
            />
          </GridContainer1>
          <GridContainer1></GridContainer1>
          <GridContainer1>
            <InfoLabel style={{ marginLeft: 10 }}>
              Duplicate this case across other buildings?
            </InfoLabel>
            <input
              type="checkbox"
              id="duplicate_case"
              {...register('duplicate_case')}
            />
          </GridContainer1>
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
          <GridContainer1>
            <InfoLabel style={{ marginLeft: 10 }}>Jobs logged by</InfoLabel>
            <InputField
              id="logged_by"
              {...register('logged_by')}
              value={'demo manager'}
            ></InputField>
          </GridContainer1>
          <GridContainer1></GridContainer1>
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
          <GridContainer1>
            <InfoLabel style={{ marginLeft: 10 }}>
              Send email to the following contractors?:
            </InfoLabel>
          </GridContainer1>
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
          </ButtonsContainer>
        </MainContainer>
        <BlueHeader />
      </MainWrapper>
    </div>
  )
}

export default Edit
