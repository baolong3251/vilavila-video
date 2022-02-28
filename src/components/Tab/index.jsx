import React, {useState} from 'react'

function Tab() {
    const [activeTab, setActiveTab] = useState(0)
    const [tabsData, setTabsData] = useState(0)

    useEffect(() => {
        let data = []

        React.Children.forEach(children, element => {
            if(!React.isValidElement(element)) return;

            const {props: { tab, children }} = element;
            data.push({tab, children})

            setTabsData(data)
        })
    }, [children])

    return (
        <div>
            <ul className="nav nav-tabs">
                
            </ul>
        </div>
    )
}

const TabPane = ({children}) => {
    return {children}
}

Tab.TabPane = TabPane;

export default Tab
