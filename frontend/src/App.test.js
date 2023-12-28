<div>
<label>
  <input
    type="radio"
    value="input"
    checked="true"
    onChange={() => setSelectedImage('input')}
  />
  Without Background
</label>
<label>
  <input
    type="radio"
    value="output"
    onChange={() => setSelectedImage('output')}
  />
  With Background
</label>
</div>









{showRadioBtns && (
  <div className='radio-btns'>
    <label>
      <input
        type='radio'
        name='backgroundOption'
        value='output'
        checked={!withBg}
        onChange={() => setWithBg(false)}
      />
      Without Background
    </label>
    <label>
      <input
        type='radio'
        name='backgroundOption'
        value='input'
        checked={withBg}
        onChange={() => setWithBg(true)}
      />
      With Background
    </label>
  </div>
)}