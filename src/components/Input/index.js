import styled from 'styled-components'
import PropTypes from 'prop-types'

const InputBase = styled.input`
width: 100%;
  padding: 15px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.contrastText};
  background-color: ${({ theme }) => theme.colors.mainBg};
  border-radius: ${({ theme }) => theme.borderRadius};
  outline: 0;
  margin-bottom: 25px;
`

export default function Input({ onChange, placeholder, name, value }) {
  return (
    <div>
      <InputBase 
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      />
    </div>  
  )
}

Input.DefaultProps = {
  value: '',
}

Input.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}