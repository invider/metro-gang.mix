function skip() {
    if (env.skip) log('waiting for the next')
    else log('skipping next trains')
    env.skip = !env.skip
}

skip.info = 'skip next trains'
