function PrimaryButton({ ...attributes }) {
    return (
      <button type="button" style={{ 
        background: '#85d8ff', 
        color: '#003B3D', 
        padding: '8px 25px', 
        borderRadius: '5px', 
        borderColor: '#003B3D',
        outline: '0', 
        textTransform: 'uppercase', 
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer', 
        boxShadow: '0px 2px 2px #003B3D'}} 
        {...attributes}>
      </button>
    );
  }
  
  export default PrimaryButton;