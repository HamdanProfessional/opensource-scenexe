  const arrasMode = (function() {
    let saved = ''
    try { saved = localStorage.tankMode || '' } catch(e) {}
    const mode = {
      active: saved === 'arras'
    }
    const options = document.querySelectorAll('.tankModeOption')
    const select = function(value) {
      mode.active = value === 'arras'
      try { localStorage.tankMode = mode.active ? 'arras' : '' } catch(e) {}
      for(const option of options) {
        option.classList.toggle('selected', (option.dataset.mode === 'arras') === mode.active)
      }
    }
    for(const option of options) {
      option.addEventListener('click', function(e) {
        if(!e.isTrusted) { return }
        select(option.dataset.mode)
      })
    }
    select(mode.active ? 'arras' : '')
    return mode
  })()
