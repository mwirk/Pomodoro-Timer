const { test, expect } = require('@playwright/test');

test.describe('Home Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000'); 
  });

  test('should render key elements', async ({ page }) => {
    await expect(page.locator('#set-timers')).toBeVisible();
    await expect(page.locator('#intervalsInput')).toBeVisible();
    await expect(page.locator('input[type="checkbox"]')).toBeVisible();
    await expect(page.locator('#start')).toBeVisible();
    await expect(page.locator('#reset')).toBeVisible();
    await expect(page.locator('#timer')).toBeVisible();
    await expect(page.locator('#taskList')).toBeVisible();
  });

  test('should update interval[1] after changing amount of cycles in input', async ({ page }) => {
    await page.fill('#intervalsInput', '1');
    await expect(page.locator('#pointer-cycles')).toHaveText('Cycle: 1 / 1');
    
  });

  test('should start timer and update displayed time', async ({ page }) => {
    await page.click('#start');
    await page.waitForTimeout(2000);
    const minuteText = await page.locator('#minute').textContent();
    const secondText = await page.locator('#second').textContent();
    expect(parseInt(minuteText)).toBeLessThanOrEqual(25);
    expect(parseInt(secondText)).toBeLessThan(60);
  });

  test('should stop timer when stop button is clicked', async ({ page }) => {
    await page.click('#start'); 
    await page.waitForTimeout(2000); 
    const timeWhileRunning = await page.locator('#minute').textContent();
    await page.click('#start'); 
    const timeAfterStop = await page.locator('#minute').textContent();
    await page.waitForTimeout(2000); 
    const timeAfterWait = await page.locator('#minute').textContent();
    expect(timeAfterStop).toBe(timeAfterWait);
});


  test('should reset timer to initial value on reset', async ({ page }) => {
    await page.click('#start');
    await page.waitForTimeout(2000); 
    await page.click('#reset');

    const minuteText = await page.locator('#minute').textContent();
    expect(minuteText).toBe('25'); 
  });

  test('should disable cycle input on loop forever checked', async ({ page }) => {
    await page.waitForSelector('#infinityMode');
    const cycleInput = page.locator('#intervalsInput');
    expect(await cycleInput.isDisabled()).toBe(false);
    await page.check('#infinityMode');
    await expect(cycleInput).toBeDisabled();

  });
  test('should display new task after adding it', async ({ page }) => {

    await expect(page.locator('#task-name')).toBeVisible();
    await expect(page.locator('#AddNewTask')).toBeVisible();


    await page.fill('#task-name', 'NewTask');
    await page.click('#AddNewTask');


    const tasksListLocator = page.locator('#tasks-list');
    await tasksListLocator.waitFor(); 

    const newTaskLocator = tasksListLocator.locator('.task-item').last();
    await expect(newTaskLocator).toContainText('NewTask');
    await expect(newTaskLocator).toContainText('Assign:1');
    await expect(newTaskLocator).toContainText('Completion: 0%');
});



  test('should export tasks to file', async ({ page }) => {
    const taskName = 'Exported Task';
    await page.fill('input[name="taskName"]', taskName);
    await page.click('#AddNewTask');
    await page.click('#ExportTasks');


  });

  test('should go back to settings on settings button', async ({ page }) => {
    await page.waitForSelector('#settings-button'); 
    const backButton = page.locator('#settings-button');
    await backButton.click(); 
    await page.waitForURL('http://localhost:3000/settings'); 
});
  test('should go back to statistics on statistics button', async ({ page }) => {
    await page.waitForSelector('#statistics-button'); 
    const backButton = page.locator('#statistics-button');
    await backButton.click(); 
    await page.waitForURL('http://localhost:3000/statistics'); 
  });

});


test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/settings'); 
  });

  test('should render key elements', async ({ page }) => {
    await expect(page.locator('#settingsLanguage')).toBeVisible();
    await expect(page.locator('#settingsWork')).toBeVisible();
    await expect(page.locator('#settingsRest')).toBeVisible();
    await expect(page.locator('#settingsFinish')).toBeVisible();
  
  });
  test('should change work sound and save to localStorage', async ({ page }) => {

    const workSoundSelect = await page.locator('#settingsWork');
    await workSoundSelect.selectOption({ label: 'Alarm' });

    await page.evaluate(() => {
      return localStorage.getItem('workSound');
    }).then(workSound => {
      expect(workSound).toBe('Alarm');
    });
  });

  
  test('should change rest sound and save to localStorage', async ({ page }) => {
    const restSoundSelect = await page.locator('#settingsRest');
    await restSoundSelect.selectOption({ label: 'Eco' });
    await page.evaluate(() => {
      return localStorage.getItem('restSound');
    }).then(restSound => {
      expect(restSound).toBe('Eco');
    });
  });

  test('should change finish sound and save to localStorage', async ({ page }) => {

  
    const finishSoundSelect = await page.locator('#settingsFinish');
    await finishSoundSelect.selectOption({ label: 'Royal' });
    await page.evaluate(() => {
      return localStorage.getItem('finishSound');
    }).then(finishSound => {
      expect(finishSound).toBe('Royal');
    });
  });

  test('should change language and save to localStorage', async ({ page }) => {


 
    const languageSelect = await page.locator('#settingsLanguage');
    await languageSelect.selectOption({ value: 'pl' });


    await page.evaluate(() => {
      return localStorage.getItem('language');
    }).then(language => {
      expect(language).toBe('pl');
    });
  });


  test('should default to English language', async ({ page }) => {

    const languageSelect = await page.locator('#settingsLanguage');
    const selectedLanguage = await languageSelect.inputValue();
    expect(selectedLanguage).toBe('en');
  });

  test('should go back to homepage on back', async ({ page }) => {
    await page.waitForSelector('#backButton'); 
    const backButton = page.locator('#backButton');
    await backButton.click(); 
    await page.waitForURL('http://localhost:3000/'); 
});

})



test.describe('Statistics page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/statistics'); 
  });
  test('should render all elements correctly', async ({ page }) => {

    const backButton = await page.locator('#backButton');
    await expect(backButton).toBeVisible();
    await expect(backButton).toHaveText('Back');

  
    const title = await page.locator('#title');
    await expect(title).toBeVisible();


    const chart = await page.locator('#chart');
    await expect(chart).toBeVisible();
  });
  test('should go back to homepage on back', async ({ page }) => {
    await page.waitForSelector('#backButton'); 
    const backButton = page.locator('#backButton');
    await backButton.click(); 
    await page.waitForURL('http://localhost:3000/'); 
});
});



