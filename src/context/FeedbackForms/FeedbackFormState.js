import { FeedbackFormContext } from "./FeedbackFormContext";
const FeedbackFormState = (props) => {

    const feedbackData = {
        fb1: ["Good"]
    }
    return (
        <FeedbackFormContext.Provider value={[feedbackData]}>
            {props.children}
        </FeedbackFormContext.Provider>
    )
}

export default FeedbackFormState;