import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const ValidationSchema = Yup.object().shape({
  titulo: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required')
    .notOneOf(['pop'], 'Title cannot contain the word "pop"'),  //notOneOf() permite que você especifique 
  autor: Yup.string()                                           //uma lista de valores que não são permitidos,
    .min(2, 'Too Short!')                                       //nesse caso a strng 'pop'
    .max(50, 'Too Long!')
    .required('Required')
});

function Questao6() {
  return (
    <div>
      <h1>Questão 6</h1>
      <Formik
        initialValues={{ titulo: '', autor: '' }}
        validationSchema={ValidationSchema}
        onSubmit={values => {
          // same shape as initial values
          console.log(values);
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <Field name="titulo" />
            {errors.titulo && touched.titulo ? (
              <div>{errors.titulo}</div>
            ) : null}

            <Field name="autor" />
            {errors.autor && touched.autor ? (
              <div>{errors.autor}</div>
            ) : null}

            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Questao6;
