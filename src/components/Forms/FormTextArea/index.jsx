import React from "react"
import "./style_formtextarea.scss"

const FormTextArea = ({ handleChange, label, ...otherProps }) => {
    return (
        <div className="formRow">
            {label && (
                <label>
                    {label}
                </label>
            )}
                      
            <textarea cols="60" rows="10" className="formTextArea" onChange={handleChange} {...otherProps}/>
                
        </div>
    )
}

export default FormTextArea;